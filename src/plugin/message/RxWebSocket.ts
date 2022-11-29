import {debounceTime, Subject, Subscription, timer} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {BaseMessage} from "../../entity/message/BaseMessage";
import {MessageCode} from "../../entity/message/MessageCode";
import {User} from "../../entity/response/User";
import store from "../../store";


export class RxWebSocket {
	
	static WEB_SOCKET_URL : string = process.env.NODE_ENV === 'development' ? 'ws://1486641sd0.iask.in:35485/ws/' : 'ws://1486641sd0.iask.in:35485/ws/';
	
	private static subject : WebSocketSubject<any>;
	private static timerSubject : Subject<any>;
	private static subscription : Subscription | undefined;
	private static timerSubscription : Subscription | undefined;
	
	static init() {
		console.log('init at ' + new Date());
		if (RxWebSocket.timerSubscription !== undefined){
			RxWebSocket.timerSubscription.unsubscribe();
			RxWebSocket.timerSubscription = undefined;
		}
		RxWebSocket.timerSubject = new Subject<any>();
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
					//收到心跳包、30s后发送下一个
					RxWebSocket.timerSubject.next(1);
					timer(30000).subscribe({
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
		const msg = new BaseMessage();
		msg.code = MessageCode.HEART_BEAT;
		RxWebSocket.subject.next(msg);
		RxWebSocket.timerSubject.next(1);//30秒后重连
	}
	
	static register(){
		RxWebSocket.subject.subscribe();
	}
	
	static unregister(){
		RxWebSocket.timerSubscription?.unsubscribe();
		RxWebSocket.subscription?.unsubscribe();
	}
	
	static post(msg : BaseMessage<any>){
		this.subject.next(msg);
	}
	
}