import { Observable } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';

// Intercept all Http methods to provide hooks for starting and ending progress bars, using an event emitter to update them
export class ProgressBarHttpInterceptorService extends Http {
    private static START_DELAY_MS: number = 100;
    private totalRequests: number = 0;
    private completedRequests: number = 0;
    private progressEmitter: EventEmitter<number> = new EventEmitter<number>();
 
    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }
 
    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url,options));
    }
 
    public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {   
        return this.intercept(super.post(url, body, options));
    }
 
    public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, options));
    }
 
    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    public subscribeToProgressEvents(subscribeFn: (x: number) => any): void {
        this.progressEmitter.subscribe(subscribeFn);
    }
 
    private intercept(observable: Observable<Response>): Observable<Response> {
        this.totalRequests++;
        // Inform subscribers that another request has been received:
        this.emitProgress();

        return observable
            .map((response: Response) => {
                this.onRequestComplete();
                return response;
            })
            .catch((error: any) => {
                this.onRequestComplete();
                return Observable.throw(error);
            });
    }

    private onRequestComplete(): void {
        this.completedRequests++;
        this.emitProgress();
        if (this.completedRequests === this.totalRequests) {
            this.onRequestsComplete();
        }
    }

    private onRequestsComplete(): void {
        this.totalRequests = 0;
        this.completedRequests = 0;
    }

    private emitProgress(): void {
        this.progressEmitter.emit(this.completedRequests / this.totalRequests);
    }
}