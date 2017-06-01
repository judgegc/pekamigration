import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleShorter'
})
export class RoleShortenerPipe implements PipeTransform {

  private readonly MAX_LENGTH = 8;
  public transform(username: string, role:string): any {
    return username.length > this.MAX_LENGTH? role[0]: role
  }

}
