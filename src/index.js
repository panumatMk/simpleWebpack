import {
    animationFrameScheduler, combineLatest,
    filter,
    fromEvent,
    interval,
    map,
    merge,
    scan,
    share,
    startWith,
    switchMap,
    tap
} from "rxjs";
import "./style.css";
import chickenSrc from './ch.png';
import {keyValue} from "./oparators/key-value";
import {combineLatestInit} from "rxjs/internal/observable/combineLatest";

const chicken = new Image();
chicken.src = chickenSrc;

const onDocumentReady$ = fromEvent(window, 'load');
const keydown$ = fromEvent(document, 'keydown').pipe(
    tap(event => {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
    }),
    share()
);

const arrowLeft$ = keydown$.pipe(
    keyValue({
        key: 'ArrowLeft',
        value: -2
    })
);

const arrowRight$ = keydown$.pipe(
    keyValue({
        key: 'ArrowRight',
        value: 2
    })
);

const arrowUp$ = keydown$.pipe(
    keyValue({
        key: 'ArrowUp',
        value: -2
    })
);

const arrowDown$ = keydown$.pipe(
    keyValue({
        key: 'ArrowDown',
        value: 2
    })
);

const x$ = merge(arrowRight$, arrowLeft$)
    .pipe(
        scan((sum, value) => {
            return sum + value
        }, 0)
    )

const y$ = merge(arrowUp$, arrowDown$)
    .pipe(
        scan((sum, value) => {
            return sum + value
        }, 0)
    )

const state$ = combineLatest({
    x: x$.pipe(startWith(0)),
    y: y$.pipe(startWith(0))
});

onDocumentReady$
    .pipe(
        switchMap(() => {
            const canvasEl = document.createElement('canvas');
            const ctx = canvasEl.getContext('2d')

            document.body.appendChild(canvasEl);

            document.body.style.margin = '0px';

            return fromEvent(window, 'resize').pipe(
                startWith(0),
                switchMap(() => {
                    canvasEl.width = window.innerWidth;
                    canvasEl.height = window.innerHeight;

                    let x = 100;
                    let y = 100;
                    let speed = 2;
                    let directionX = 1;
                    let directionY = 1;
                    const radius = 0;

                    return state$.pipe(
                        tap(({x: dx, y: dy}) => {
                            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                            // ctx.beginPath();
                            // ctx.fillStyle = 'green';
                            // ctx.arc(x, y, radius, 0, 2 * Math.PI * 50);
                            // ctx.fill();

                            ctx.drawImage(chicken, x + dx, y + dy);

                            // const newX = x + directionX * speed;
                            // const newY = y + directionY * speed;
                            //
                            // if (newX + chicken.width >= canvasEl.width || newX - radius <= 0) {
                            //     directionX = -directionX
                            // }
                            //
                            // if (newY + chicken.height >= canvasEl.height || newY - radius <= 0) {
                            //     directionY = -directionY
                            // }

                            // x = newX;
                            // y = newY;
                        })
                    )
                })
            )
        })
    )
    .subscribe();

