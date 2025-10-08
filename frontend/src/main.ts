import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

// 1. Importe as dependências do Lottie aqui
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// 2. A função bootstrapApplication recebe apenas um objeto de configuração
bootstrapApplication(AppComponent, {
  providers: [
    // Providers do Ionic e de Rotas
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Provider do Lottie (movido para cá para centralizar a configuração)
    provideLottieOptions({
        player: () => player,
    }),

    // Provider do HttpClient (necessário para o Lottie carregar a animação)
    provideHttpClient(),
  ],
})
.catch((err) => console.error(err));

