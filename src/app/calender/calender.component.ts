import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppointmentService } from '../../AppointmentService';
import { Appointment } from '../appointment';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [
    HttpClientModule,
    MatDatepickerModule,
    MatCardModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    DatePipe,
  ],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.scss',
  providers: [provideNativeDateAdapter(), AppointmentService],
})
export class CalenderComponent {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;
  dataSource: Appointment[] = [];
  hoursOfDay = [...Array(24).keys()];
  selected: Date | null;
  public dates: Date[] = [];
  constructor(
    private appointmentService: AppointmentService,
    public dialog: MatDialog,
  ) {
    this.dataSource = [];
    const tomorrow = new Date(2024, 4, 11);
    this.dates = [new Date(), new Date(tomorrow)];

    appointmentService.getAppointments().subscribe((x: Appointment[]) => {
      x.map((y) => {
        this.dataSource.push(y);
      });
      this.calendar.updateTodaysDate();
    });
  }
  drop(event: CdkDragDrop<string[], string[], Appointment>) {
    event.item.data.registered.setHours(event.currentIndex - 1);

    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  }
  checkExistAppointment(hour: number) {
    if (this.selected) {
      return this.dataSource.filter(
        (x) =>
          x.registered.getFullYear() == this.selected?.getFullYear() &&
          x.registered.getMonth() == this.selected.getMonth() &&
          x.registered.getDate() == this.selected.getDate() &&
          x.registered.getHours() == hour,
      );
    } else return null;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAppointmentDialogComponent, {
      data: new Appointment(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      const data = result as Appointment;
      data.registered.setDate(data.registered.getDate());
      data.registered.setHours(data.hour);
      this.dataSource.push(data);
      this.calendar.updateTodaysDate();
    });
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      return this.dataSource.find(
        (x) =>
          x.registered.getDate() == date.getDate() &&
          x.registered.getMonth() == date.getMonth() &&
          x.registered.getFullYear() == date.getFullYear(),
      )
        ? 'special-date'
        : 'normal-date';
    };
  }
}

@Component({
  selector: 'app-add-appointment-dialog',
  templateUrl: './add-appointment-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class AddAppointmentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
