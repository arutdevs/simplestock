import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = !req.url.startsWith('http');

  if (isApiRequest) {
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-App-Version': '1.0.0',
      },
    });
    return next(apiReq);
  }

  return next(req);
};
