import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Appointment } from "./app/appointment";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private serverUrl = "../"
  constructor(private http: HttpClient) { }


  getAppointments(): Observable<Appointment[]> {

    return this.http.get<Appointment[]>(`${this.serverUrl}assets/Appointment.json`) .pipe(
      map(response => {
        response =response.map(x=>{ x.registered=new Date(x.registered);  ; return x;});
        return response;
      }));
      // .pipe(
      //   switchMap(() => {
      //     var user: User[] = [{ _id: "11111", name: "ali" }];
      //     return of(user);
      //   })
      // );
  }
}
