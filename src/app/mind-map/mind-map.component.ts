import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { PersService } from '../pers.service';
import { mapDicItem, mindMapItem, mindMapLink } from 'src/Models/mapDicItem';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { taskState } from 'src/Models/Task';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Characteristic } from 'src/Models/Characteristic';
import { Subject } from 'rxjs';
import { Pers } from 'src/Models/Pers';

@Component({
  selector: 'app-mind-map',
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.css']
})
export class MindMapComponent implements OnInit {
  private unsubscribe$ = new Subject();

  contextmenu = false;
  date: mindMapItem[] = [];
  dic: Map<string, mapDicItem>;
  id: any;
  idx: any;
  item: mapDicItem;
  links: mindMapLink[] = [];
  options: EChartOption = this.getChart();
  pers: Pers;
  updateOptions = {
    series: [{
      data: this.date,
      links: this.links
    }]
  };

  constructor(public srv: PersService, private location: Location, private _bottomSheet: MatBottomSheet, public dialog: MatDialog, private router: Router) { }

  choose(n) {
    this.contextmenu = false;

    if (n == 'открыть') {
      switch (this.item.type) {
        case 't':
          this.srv.openTask(this.id);
          break;
        case 'ch':
          this.srv.openCharact(this.id);
          break;

        case 'pers':
          this.srv.openPers();
          break;

        default:
          break;
      }
    }
    else if (n == 'удалить') {
      switch (this.item.type) {
        case 't':
          this.srv.delAbil(this.item.el.id);
          break;
        case 'ch':
          this.srv.DeleteCharact(this.id);
          break;
      }

      this.srv.savePers(false);
    }
    else if ((n == 'добавить')) {
      this.srv.isDialogOpen = true;
      const dialogRef = this.dialog.open(AddItemDialogComponent, {
        panelClass: 'my-dialog',
        data: { header: 'Добавить', text: '' },
        backdropClass: 'backdrop'
      });

      dialogRef.afterClosed()
        .subscribe(name => {
          if (name) {
            switch (this.item.type) {
              case 'pers':
                // Навык напрямую
                if (this.pers.isNoAbs) {
                  let firstCharact: Characteristic;
                  if (this.pers.characteristics.length > 0) {
                    firstCharact = this.pers.characteristics[0];
                  }
                  // Навык к характеристике
                  else {
                    this.srv.addCharact('');
                    firstCharact = this.pers.characteristics[0];
                  }
                  this.srv.addAbil(firstCharact.id, name);
                }
                else {
                  this.srv.addCharact(name);
                }
                break;
              case 'ch':
                this.srv.addAbil(this.id, name);
                break;
              case 't':
                this.item.el.tasks[0].isSumStates = true;
                let state = new taskState();
                state.value = this.item.el.tasks[0].value;
                state.requrense = this.item.el.tasks[0].requrense;
                state.image = this.srv.GetRndEnamy(state, this.pers.level, this.pers.maxPersLevel);
                state.name = name;
                this.item.el.tasks[0].states.push(state);
                break;
            }

            this.srv.savePers(false);
          }
          this.srv.isDialogOpen = false;
        });
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (!this.srv.pers$.value) {
      this.router.navigate(['/main']);
    }

    this.srv.pers$.subscribe(n => {
      this.pers = n;
      this.udateGraph();
    });
  }

  onChartEvent(event: any, type: string) {
    this.id = event.data.id;
    this.idx = event.dataIndex;
    this.item = this.dic.get(this.id);
    this.contextmenu = true;
  }

  private getChart(): EChartOption<EChartOption.Series> {
    return {
      title: {
      },
      tooltip: { show: false },
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',//'force', 'circular'
          force: {
            repulsion: 170,
            edgeLength: 70,
            //gravity: 0.17
          },
          roam: true,
          nodeScaleRatio: 0.0005,
          //draggable: true,
          //focusNodeAdjacency: true,
          symbol: 'circle',
          label: {
            normal: {
              show: true,
              color: 'black'
            }
          },
          edgeSymbol: ['none', 'arrow'],
        }
      ]
    };
  }

  private udateGraph() {
    this.dic = new Map<string, mapDicItem>();
    this.date = [];
    this.links = [];

    let idx = 0;
    this.dic.set('pers', new mapDicItem('pers', this.pers.name, idx, null));
    idx++;
    this.date.push(new mindMapItem('pers', this.pers.name, 60, 'LawnGreen'));
    // Характеристики
    for (const ch of this.pers.characteristics) {
      if (!this.pers.isNoAbs) {
        this.dic.set(ch.id, new mapDicItem('ch', ch.name, idx, ch));
        idx++;
        this.date.push(new mindMapItem(ch.id, ch.name, 45, 'LemonChiffon'));
        this.links.push(new mindMapLink(this.dic.get('pers').index, this.dic.get(ch.id).index));
      }
      // Навыки
      for (const ab of ch.abilities) {
        // SumStates
        for (const t of ab.tasks) {
          this.dic.set(t.id, new mapDicItem('t', t.name, idx, ab));
          if (t.isPerk) {
            this.date.push(new mindMapItem(t.id, t.name, 25, 'yellow'));
          }
          else {
            this.date.push(new mindMapItem(t.id, t.name, 25, 'transparent'));
          }
          idx++;

          // Если в требованиях есть с такой же характеристикой, ссылку не делаем
          let haveSameCharact = false;
          for (const r of t.reqvirements) {
            for (const abs of ch.abilities) {
              for (const tscs of abs.tasks) {
                if (tscs.id == r.elId) {
                  haveSameCharact = true;
                }
              }
            }
          }

          if (!haveSameCharact) {
            this.links.push(new mindMapLink(!this.pers.isNoAbs ? this.dic.get(ch.id).index : this.dic.get('pers').index, this.dic.get(t.id).index));
          }
        }
      }
    }
    // Требования
    for (const ch of this.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const t of ab.tasks) {
          for (const r of t.reqvirements) {
            const source = this.dic.get(t.id).index;
            const target = this.dic.get(r.elId).index;
            this.links.push(new mindMapLink(target, source));
          }
        }
      }
    }

    this.updateOptions = {
      series: [{
        data: this.date,
        links: this.links
      }]
    };
  }
}
