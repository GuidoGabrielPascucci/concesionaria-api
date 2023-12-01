export class Car {
    
  private id: number;
  private licensePlate: string;
  private brand: string;
  private model: string;
  private color: string;
  private price: number;
  private photo: string;
  private mileage: number;
  private year: number;

  public constructor(id: number, licensePlate: string,  brand: string,  model: string, color: string, price: number, photo: string,  mileage: number,  year: number) {

    this.id = id;
    this.licensePlate = licensePlate;
    this.brand = brand;
    this.model = model;
    this.color = color;
    this.price = price;
    this.photo = photo;
    this.mileage = mileage;
    this.year = year;

  }

}