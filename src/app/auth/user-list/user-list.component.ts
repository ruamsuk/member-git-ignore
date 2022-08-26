import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../../models/roles.model';
import { AuthService } from '../auth.service';
import { map, takeUntil } from 'rxjs/operators';
import firebase from 'firebase';
import User = firebase.User;
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Members } from '../../models/members.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  searchKey!: string;
  displayedColumns: string[] = [
    'id', 'userName', 'role', 'key'
  ];
  dataSource = new MatTableDataSource<any>([]);
  users!: Observable<any[]>;
  notifier = new Subject()

  isLoading = false;
  isFound = false;

  destroy$: Subject<boolean> = new Subject<boolean>();
  user: User | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatPaginator;

  constructor(
    public authService: AuthService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.getUsers();
    this.isLoggedIn();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchKey = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchClear(): void {
    this.searchKey = '';
    this.dataSource.filter = this.searchKey;
  }

  isLoggedIn() {
    this.afAuth.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user = user;
        }
      });
  }

  onUpdate(row: any) {}

  onDelete(user: any) {
    console.log(user.username);
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการลบข้อมูล',
        message: `ต้องการลบข้อมูล : ${user.username} แน่ใจหรือไม่?`
      }
    });
    confirmDialog.afterClosed().subscribe(res => {
      if (res) {
        this.authService.deleteUser(user);
      }
    });
  }

  private getUsers(): any {
    this.isLoading = true;
    this.authService.getUsers()
      .snapshotChanges()
      .pipe(
        takeUntil(this.notifier),
        map(chg =>
          chg.map(x =>
            ({id: x.payload.doc.id, ...x.payload.doc.data()})
          )
        )
      ).subscribe(user => {
        this.dataSource = new MatTableDataSource<UserRole>(user);
        this.dataSource.paginator = this.paginator;
        // @ts-ignore
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.isFound = user.length <= 0;
    });
  }



  goProfile() {
    this.router.navigate(['/members/user-profile']).catch();
  }

  goMembers() {
    this.router.navigate(['/members/member-list']).catch();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
