import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ProgressBarHttpInterceptorService } from './progress-bar-http-interceptor.service';

@Component({
    selector: 'bge-http-progress-determinate',
    template: `
    <div class="progress-wrapper">
        <div class="progress-inner" [style.width]="progressBarWidth">
        </div>
    </div>
    `,
    styles: [`
    .progress-wrapper {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 8px;
    }

    .progress {
        background-color: currentColor;
        transition: 0.3s ease opacity;
        opacity: 1;
    }

    .progress.hidden {
        opacity: 0;
    }
    `]
})
export class DeterminateHttpProgressBarComponent implements OnInit {
    protected progressBarWidth: string = '0';

    constructor(
        private http: Http
    ) {}

    public ngOnInit(): void {
        // We will override the usual Http provider in the app bootstrap, but use a 
        // cast here so we can use the subclass's functionality
        (<ProgressBarHttpInterceptorService>this.http)
            .subscribeToProgressEvents((progress: number) => {
            this.progressBarWidth = `${progress * 100}%`; 
            });
    }
}