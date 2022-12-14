import {debounceTime, Observable, Observer, Subject, Subscription, timer} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {BaseMessage} from "../../entity/message/BaseMessage";
import {MessageCode} from "../../entity/message/MessageCode";
import {User} from "../../entity/response/User";
import store from "../../store";



export class RxWebSocket {
	
	static WEB_SOCKET_URL : string = 'ws://1486641sd0.iask.in:35485/ws/';
	
	private static subject : WebSocketSubject<BaseMessage<any>>;
	private static timerSubject : Subject<any>;
	private static subscription : Subscription | undefined;
	private static timerSubscription : Subscription | undefined;
	
	static init() {
		console.log('init at ' + new Date());
		if (RxWebSocket.timerSubscription !== undefined){
			RxWebSocket.timerSubscription.unsubscribe();
			RxWebSocket.timerSubscription = undefined;
		}
		RxWebSocket.timerSubject = new Subject<BaseMessage<any>>();
		if (RxWebSocket.subscription !== undefined){
			RxWebSocket.subscription.unsubscribe();
			RxWebSocket.subscription = undefined;
		}
		const currentUser : User|undefined = store.getters.currentUser;
		if (currentUser === undefined){
			return;
		}
		RxWebSocket.subject = webSocket<any>(RxWebSocket.WEB_SOCKET_URL + currentUser.username);
		RxWebSocket.initHeartbeat();
	}
	
	private static initHeartbeat(){
		RxWebSocket.timerSubscription = RxWebSocket.timerSubject.pipe(debounceTime(30000)).subscribe({
			next(value : any) {
				RxWebSocket.init();
			},
		});
		RxWebSocket.subscription = RxWebSocket.subject.subscribe({
			next(msg : BaseMessage<any>){
				if (msg.code === MessageCode.HEART_BEAT){
					console.log('receive heartbeat at ' + new Date());
					//收到心跳包、30s后发送下一个
					RxWebSocket.timerSubject.next(1);
					timer(29000).subscribe({
						next(value){
							RxWebSocket.sendHeartbeat();
						}
					});
				}
			}
		});
		RxWebSocket.sendHeartbeat();
	}
	
	private static sendHeartbeat(){
		console.log('send heartbeat at ' + new Date());
		const msg = new BaseMessage();
		msg.code = MessageCode.HEART_BEAT;
		RxWebSocket.subject.next(msg);
		RxWebSocket.timerSubject.next(1);
	}
	
	static register(observer: Partial<Observer<BaseMessage<any>>>) : Subscription {
		return RxWebSocket.subject.subscribe(observer);
	}
	
	static post(msg : BaseMessage<any>){
		this.subject.next(msg);
	}
	
}