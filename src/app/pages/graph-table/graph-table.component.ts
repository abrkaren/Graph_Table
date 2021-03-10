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
    }
  ]

  positionFilter = new FormControl('');
  node1Filter = new FormControl('');
  node2Filter = new FormControl('');

  dataSource = new MatTableDataSource();

  columnsToDisplay = ['position', 'node1', 'node2'];

  filters = {
    position: '',
    node1: '',
    node2: ''
  };

  constructor() {
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

    this.node1Filter.valueChanges
      .subscribe(
        node1 => {
          this.filters.node1 = node1;
          this.dataSource.filter = JSON.stringify(this.filters);
        }
      )

    this.node2Filter.valueChanges
      .subscribe(
        node2 => {
          this.filters.node2 = node2;
          this.dataSource.filter = JSON.stringify(this.filters);
        }
      )
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFn = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data.position + '').indexOf(searchTerms.position) !== -1
          && (data.node1 + '').indexOf(searchTerms.node1) !== -1
          && (data.node2 + '').indexOf(searchTerms.node2) !== -1
    }
    return filterFn;
  }

}
