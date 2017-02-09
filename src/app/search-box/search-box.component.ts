import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  @Input() nodes: vis.DataSet<vis.Node>;
  @Output() searchComplete = new EventEmitter<number>();

  private searchQuery: Subject<string> = new Subject<string>();
  private autocompleteList: { id: number, name: string, distance: number, group: string }[] = [];
  private input: string = '';
  private readonly AUTOCOMPLETE_MAX_VARIANTS = 5;

  constructor() { }

  ngOnInit() {
    this.searchQuery
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe({
        next: q => {
          this.autocompleteList = q.length > 0 ?
            this.buildAutocompleteList(q).slice(0, this.AUTOCOMPLETE_MAX_VARIANTS) :
            [];

          if (this.autocompleteList.length > 0 && this.autocompleteList[0].distance === 0) {
            this.searchComplete.emit(this.autocompleteList[0].id);
            this.autocompleteList = [];
          }
        }
      });
  }


  private search(input: string) {
    this.searchQuery.next(input);
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

  private wordsDist(a: string, b: string) {
    if (a == b) return 0;
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 2, // substitution
            Math.min(matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1)); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  }

  private OnClickAutoselectItem(user: { id: number, name: string, distance: number, group: string }) {
    this.input = user.name;
    this.autocompleteList = [];
    this.searchComplete.emit(user.id);
  }

}
