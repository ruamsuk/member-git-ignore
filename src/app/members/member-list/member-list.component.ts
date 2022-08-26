import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Members } from '../../models/members.model';
import { MembersService } from '../members.service';
import { Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MembersComponent } from '../members/members.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MemberDetailComponent } from '../member-detail/member-detail.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../auth/auth.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Members>();
  loading = false;
  searchKey!: string;
  isFound = false;
  isAdmin = false;
  isVarify: boolean | undefined = false;
  user!: firebase.User | null;
  errMsg = '';
  destroy: Subject<boolean> = new Subject<boolean>();

  displayedColumns: string[] = [
    'id', 'rank', 'firstname', 'lastname', 'birthdate', 'key'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private memService: MembersService,
    private dialog: MatDialog,
    private router: Router,
    public auth: AuthService
  ) {
    this.getUser();
    this.getAllmember();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  onCreate() {
    this.memService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '450px';

    this.dialog.open(MembersComponent, dialogConfig);
  }

  onDetail(member: Members) {
    this.memService.populateForm(member);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

    this.dialog.open(MemberDetailComponent, dialogConfig);
  }

  onUpdate(member: Members) {
    this.memService.populateForm(member);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '450px';

    this.dialog.open(MembersComponent, dialogConfig);
  }

  onDelete(member: Members) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการลบข้อมูล',
        message: `ต้องการลบข้อมูล : ${member.firstname} ${member.lastname} แน่ใจหรือไม่?`
      }
    });
    confirmDialog.afterClosed().subscribe(res => {
      if (res) {
        this.memService.deleteMember(member);
      }
    });
  }

  showUsers() {
    this.router.navigate(['/auth/user-list']).catch();
  }

  /** เพื่อตรวจสอบว่าเป็น admin หรือ user เพื่อกำหนดสิทธิการเข้าถึง */
  private getUser() {
    let user = this.auth.getAuth();
    this.isVarify = user?.emailVerified;
    this.auth.getUser(user?.uid)
      .pipe(take(1))
      .subscribe(r => {
        // @ts-ignore
        this.isAdmin = r?.role == 'admin';
      });
  }

  private getAllmember() {
    if (this.isVarify) {
      this.loading = true;

      this.memService.getMembers()
        .snapshotChanges()
        .pipe(
          takeUntil(this.destroy),
          map(change =>
            // @ts-ignore
            change.map(x =>
              ({id: x.payload.doc.id, ...x.payload.doc.data()})
            )
          )
        ).subscribe(member => {
        this.dataSource = new MatTableDataSource<Members>(member);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
        this.isFound = member.length <= 0;
      });
    } else {
      this.errMsg = 'ต้องยืนยันอีเมล์ก่อนถึงจะดูรายชื่อสมาชิกได้';
    }
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
