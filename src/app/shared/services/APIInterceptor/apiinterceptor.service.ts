import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIInterceptorService implements HttpInterceptor{

  private apiKeyOpenData = 'JhE9zJKxo1wuH2G7Gc1dyndAvo8qRwKQtcGBw9pWdYeGOrLeegDiTa2BNEMTTH8RYI34eH0GSW3bYeCMpcSeaxanMb9rHtI26tD3ob5jfjJ3AshxMoWvNDPkbJDWJ4suQu83nIPLeDDWJxCd4h32VfRhlekqwokyPchCh498csnenEtSL1S9ZCmnFwdk4t7EpVxNZS4pT0jsPnUx9USinYr1YX5nwWUKHKbgV2fFb63GebUboWrP6mHDM3';
  private language = 'sk';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/category')) {
      const modifiedRequest = request.clone({
        setHeaders: { 'key': this.apiKeyOpenData, 'Language': this.language },
      });
      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}
