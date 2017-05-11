import { PekamigrationPage } from './app.po';

describe('pekamigration App', () => {
  let page: PekamigrationPage;

  beforeEach(() => {
    page = new PekamigrationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
