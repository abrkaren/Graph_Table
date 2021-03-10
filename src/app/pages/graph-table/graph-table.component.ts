import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { GraphTable } from "../../shared/interfaces";

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-graph-table',
  templateUrl: './graph-table.component.html',
  styleUrls: ['./graph-table.component.scss']
})
export class GraphTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  DATA: GraphTable[] = [
    {
      userId: 1,
      name: "a",
      type: "user_node"
    },
    {
      type: "user_node",
      name: "b",
      userId: 2
    },
    {
      type: "user_node",
      name: "c",
      userId: 3
    },
    {
      type: "user_node",
      name: "d",
      userId: 4
    },
    {
      type: "user_to_user_link", // this means that the user with id 1 is linked to user with id 2
      node1: 1,
      node2: 2
    },
    {
      type: "user_to_user_link",
      node1: 2,
      node2: 3
    },
    {
      type: "user_to_user_link",
      node1: 3,
      node2: 4
    },
    {
      type: "user_to_user_link",
      node1: 4,
      node2: 1
    },
    {
      type: "user_node",
      name: "e",
      userId: 5
    },
    {
      type: "user_to_user_link",
      node1: 5,
      node2: 1
    },
    {
      type: "user_node",
      name: "g",
      userId: 15
    },
    {
      type: "user_to_user_link",
      node1: 15,
      node2: 4
    },
    {
      type: "user_node",
      name: "f",
      userId: 9
    },
    {
      type: "user_to_user_link",
      node1: 3,
      node2: 9
    },
    {
      type: "user_to_user_link",
      node1: 2,
      node2: 3
    },
    {
      type: "user_to_user_link",
      node1: 5,
      node2: 15
    }
  ]

  positionFilter = new FormControl('');
  name1Filter = new FormControl('');
  name2Filter = new FormControl('');

  dataSource = new MatTableDataSource();

  columnsToDisplay = ['position', 'name1', 'name2'];

  filters = {
    position: '',
    name1: '',
    name2: ''
  };

  constructor() {
    this.generateTableData()
    this.dataSource.data = this.DATA.filter(item => item.type == "user_to_user_link");
    this.dataSource.filteredData.map((item, i) => {
      item['position'] = ++i;
    })
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(){
    this.positionFilter.valueChanges
      .subscribe(
        position => {
          this.filters.position = position;
          this.dataSource.filter = JSON.stringify(this.filters);
        }
      )

    this.name1Filter.valueChanges
      .subscribe(
        name1 => {
          this.filters.name1 = name1;
          this.dataSource.filter = JSON.stringify(this.filters);
        }
      )

    this.name2Filter.valueChanges
      .subscribe(
        name2 => {
          this.filters.name2 = name2;
          this.dataSource.filter = JSON.stringify(this.filters);
        }
      )
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  generateTableData() {
    this.DATA.forEach(item => {
      if(item.type == "user_to_user_link") {
        let currentName1 = this.DATA.filter(i => i.userId == item.node1);
        let currentName2 = this.DATA.filter(i => i.userId == item.node2);
        item.name1 = currentName1[0].name;
        item.name2 = currentName2[0].name;
      }
    })
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFn = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data.position + '').indexOf(searchTerms.position) !== -1
          && (data.name1).indexOf(searchTerms.name1) !== -1
          && (data.name2).indexOf(searchTerms.name2) !== -1
    }
    return filterFn;
  }

}
