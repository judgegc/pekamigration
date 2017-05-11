import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { DataProviderService } from './../data-provider.service';
import { RequestStatus, Status } from './../request-status.interface';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  @Input() nodes: vis.DataSet<vis.Node>;
  @Output() searchComplete = new EventEmitter<number>();

  public input: string = '';

  private searchQuery: Subject<string> = new Subject<string>();
  private autocompleteList: { id: number, name: string, distance: number, group: string }[] = [];

  private readonly AUTOCOMPLETE_MAX_VARIANTS = 5;


  constructor(private dataProvider: DataProviderService) { }

  ngOnInit() {
    this.searchQuery
      .debounceTime(500)
      .subscribe({
        next: q => {
          this.autocompleteList = q.length > 0 ?
            this.buildAutocompleteList(q).slice(0, this.AUTOCOMPLETE_MAX_VARIANTS) :
            [];
        }
      });



    this.dataProvider.OnRequestStatus.subscribe({
      next: (s: RequestStatus) => {
        if (s.status == Status.END && this.input !== undefined) {
          this.searchQuery.next(this.input);
        }
      }
    });
  }


  public search(input: string) {
    this.searchQuery.next(input);
  }

  public getAutocompleteList()
  {
    return this.autocompleteList;
  }
  public confirm(event) {
    if (event.keyCode == 13) {

      if (this.autocompleteList.length > 0 && this.autocompleteList[0].distance === 0) {

        this.searchComplete.emit(this.autocompleteList[0].id);
        this.autocompleteList = [];

      }

    }
  }

  private buildAutocompleteList(query: string) {
    return this.nodes
      .map(n => ({ id: n.id, name: n.label, distance: this.wordsDist(query.toLowerCase(), n.label.toLowerCase()), group: n.group }))
      .sort((a, b) => {
        if (a.name === b.name) {
          return 0;
        }
        else {
          return a.distance - b.distance;
        }
      });
  }

  private wordsDist(needle: string, b: string) {

    if (b.indexOf(needle) !== -1) {    
      return (b.length - needle.length) * 0.5;
    }

    if (needle == b) return 0;
    if (needle.length == 0) return b.length;
    if (b.length == 0) return needle.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= needle.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= needle.length; j++) {
        if (b.charAt(i - 1) == needle.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 2, // substitution
            Math.min(matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1)); // deletion
        }
      }
    }

    return matrix[b.length][needle.length];
  }

  public OnClickAutoselectItem(user: { id: number, name: string, distance: number, group: string }) {
    this.input = user.name;
    this.autocompleteList = [];
    this.searchComplete.emit(user.id);
  }

}
