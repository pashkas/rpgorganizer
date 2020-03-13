import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { v4 as uuid } from 'uuid';
import { PersService } from '../pers.service';
import { mapDicItem, mindMapItem, mindMapLink } from 'src/Models/mapDicItem';
import { MindMapOptionsComponent } from './mind-map-options/mind-map-options.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { taskState } from 'src/Models/Task';

@Component({
  selector: 'app-mind-map',
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.css']
})
export class MindMapComponent implements OnInit {
  date: mindMapItem[] = [];
  dic: Map<string, mapDicItem>;
  links: mindMapLink[] = [];
  options: EChartOption = this.getChart();
  updateOptions = {
    series: [{
      data: this.date,
      links: this.links
    }]
  };

  constructor(private srv: PersService, private _bottomSheet: MatBottomSheet, public dialog: MatDialog) { }

  ngOnInit() {
    this.udateGraph();
  }

  onChartEvent(event: any, type: string) {
    const id = event.data.id;
    let idx = event.dataIndex;

    let item = this.dic.get(id);

    let ref = this._bottomSheet.open(MindMapOptionsComponent);

    ref.afterDismissed().subscribe(n => {
      if (n == 'открыть') {
        switch (item.type) {
          case 't':
            this.srv.openTask(id);
            break;
          case 'ch':
            this.srv.openCharact(id);
            break;

          case 'pers':
            this.srv.openPers();
            break;

          default:
            break;
        }
      }
      else if (n == 'удалить') {
        switch (item.type) {
          case 't':
            this.srv.delAbil(item.el.id);
            break;
          case 'ch':
            this.srv.DeleteCharact(id);
            break;
        }

        this.srv.savePers(false);
        this.udateGraph();
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
              switch (item.type) {
                case 'pers':
                  this.srv.addCharact(name);
                  break;
                case 'ch':
                  this.srv.addAbil(id, name);
                  break;
                case 't':
                  item.el.tasks[0].isSumStates = true;
                  let state = new taskState();
                  state.value = item.el.tasks[0].value;
                  state.requrense = item.el.tasks[0].requrense;
                  state.image = this.srv.GetRndEnamy(state);
                  state.name = name;
                  item.el.tasks[0].states.push(state);
                  break;
              }

              this.srv.savePers(false);
              this.udateGraph();
            }
            this.srv.isDialogOpen = false;
          });


      }
    });
  }

  private getChart(): EChartOption<EChartOption.Series> {
    return {
      title: {
        text: 'Карта персонажа'
      },
      tooltip: {},
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',//'force', 'circular'
          force: {
            repulsion: 500,
            // edgeLength: 40
          },
          roam: true,
          symbol: 'circle',
          label: {
            normal: {
              show: true,
              color: 'black'
            }
          },
          edgeSymbol: ['none', 'none'],
        }
      ]
    };
  }

  private udateGraph() {
    this.dic = new Map<string, mapDicItem>();
    this.date = [];
    this.links = [];

    let idx = 0;
    this.dic.set('pers', new mapDicItem('pers', this.srv.pers.name, idx, null));
    idx++;
    this.date.push(new mindMapItem('pers', this.srv.pers.name, 100, 'LawnGreen'));
    // Характеристики
    for (const ch of this.srv.pers.characteristics) {
      this.dic.set(ch.id, new mapDicItem('ch', ch.name, idx, ch));
      idx++;
      this.date.push(new mindMapItem(ch.id, ch.name, 60, 'GreenYellow'));
      this.links.push(new mindMapLink(this.dic.get('pers').index, this.dic.get(ch.id).index));
      // Навыки
      for (const ab of ch.abilities) {
        // SumStates
        for (const t of ab.tasks) {
          this.dic.set(t.id, new mapDicItem('t', t.name, idx, ab));
          this.date.push(new mindMapItem(t.id, t.name, 40, 'LemonChiffon'));
          idx++;
          this.links.push(new mindMapLink(this.dic.get(ch.id).index, this.dic.get(t.id).index));
          if (t.isSumStates) {
            for (const st of t.states) {
              this.dic.set(st.id, new mapDicItem('st', st.name, idx, t));
              idx++;
              this.date.push(new mindMapItem(st.id, st.name, 15, 'LemonChiffon'));
              this.links.push(new mindMapLink(this.dic.get(t.id).index, this.dic.get(st.id).index));
            }
          }
        }
      }
    }
    // Требования
    for (const ch of this.srv.pers.characteristics) {
      for (const ab of ch.abilities) {
        for (const t of ab.tasks) {
          for (const r of t.reqvirements) {
            const source = this.dic.get(t.id).index;
            const target = this.dic.get(r.elId).index;
            this.links.push(new mindMapLink(source, target));
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
