import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { BookService } from 'src/app/services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from 'src/app/models/book.model';

const listBook: Book[] = [
  {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2,
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 20,
    amount: 1,
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 8,
    amount: 7,
  },
];

describe('Cart component', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CartComponent],
      providers: [BookService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    // with the fixture extract the component
    fixture = TestBed.createComponent(CartComponent);
    // Component instance
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(BookService);
    //this way is the way to ignore the services that are called in the ngOnInit
    spyOn(service, 'getBooksFromCart').and.callFake(() => null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getTotalPrice returns amount', () => {
    const totalPrice = component.getTotalPrice(listBook);
    expect(totalPrice).toBeGreaterThan(0);
    // negative params
    expect(totalPrice).not.toBe(0);
  });

  it('onInputNumberChange increments correctly', () => {
    const action = 'plus';
    const book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 2,
    };
    // this is the best way to extract a private element of the page or component in this case extract a service
    // IMPORTANT  always call first the spay before that call the component method
    const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);

    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);
    expect(book.amount === 3).toBeTrue();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onInputNumberChange decrements correctly', () => {
    const action = 'minus';
    const book = listBook[0];
    // this is the best way to extract a private element of the page or component in this case extract a service
    // IMPORTANT  always call first the spay before that call the component method
    const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);

    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);
    expect(book.amount === 1).toBeTrue();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onClearBooks works correctly', () => {
    // In this case use callThroug because we need to create a spy but almost neet execute the method its different when you use callFake because in callFake you don't want call the method
    const spy1 = spyOn(
      component as any,
      '_clearListCartBook'
    ).and.callThrough();
    const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component.listCartBook = listBook;
    component.onClearBooks();
    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Is not necesary call to private methods
  it('_clearListCartBook works correctly', () => {
    const spy1 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component["_clearListCartBook"]();
    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalled();
  })
});
