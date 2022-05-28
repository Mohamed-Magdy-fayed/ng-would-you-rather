import { Component, Input, OnInit } from '@angular/core';
import { arraying } from 'src/firebase/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user: any
  answers: any
  questions: any
  total: any

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.answers = this.user && arraying(this.user.answers).length
      this.questions = this.user && this.user.questions.length
      this.total = this.answers + this.questions
    }, 1000);
  }

}
