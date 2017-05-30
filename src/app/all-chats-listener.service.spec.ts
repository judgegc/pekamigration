import { TestBed, inject } from '@angular/core/testing';

import { AllChatsListenerService } from './all-chats-listener.service';

describe('AllChatsListenerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllChatsListenerService]
    });
  });

  it('should be created', inject([AllChatsListenerService], (service: AllChatsListenerService) => {
    expect(service).toBeTruthy();
  }));
});
