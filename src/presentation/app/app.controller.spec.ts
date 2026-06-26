import { AppController } from './app.controller';

describe('AppController', () => {
  it('returns english dictionary message', () => {
    const controller = new AppController();
    expect(controller.root()).toEqual({ message: 'English Dictionary' });
  });
});
