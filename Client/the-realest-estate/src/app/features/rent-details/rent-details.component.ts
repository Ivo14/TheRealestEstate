import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Rent } from 'src/app/types/Rent';

@Component({
  selector: 'app-rent-details',
  templateUrl: './rent-details.component.html',
  styleUrls: ['./rent-details.component.css']
})
export class RentDetailsComponent implements OnInit{
  rent: Rent | undefined;
  rentPerSquare: string | undefined;
  isOwner: boolean | undefined;

  showPopup: boolean = false;
  ownerEmail: string | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router:Router) {}

  deleteRent():void {
    this.apiService.deleteRent(this.rent?._id)
      .subscribe(
        (data) => {
          this.router.navigate(['rent']);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      this.apiService.getOneRentout(params['rentId']).subscribe(data => {
        this.rent = data;
        this.rentPerSquare = (Number(this.rent?.rent) / Number(this.rent?.area)).toFixed(2);
        this.isOwner = localStorage.getItem('_id') == this.rent.ownerId;
      })
    })
  }
}
