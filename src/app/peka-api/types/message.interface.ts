export interface IMessage {
    id: number;  // Идентификатор сообщения
    channel: string; // Идентификатор канала, см. раздел 4
    from: { // Объект пользователя отправителя сообщения
        id: number; // Идентификатор пользователя
        name: string; // Имя пользователя
    },
    to: Object | null; // Объект пользователя к которому обращаются, аналогично from
    text: string; // Текст сообщения
    time: number; // Время сообщения
    type: string; // Тип сообщения, см. раздел 5
    store: { // Активные бонусы пользователя отправителя
        bonuses: number[]; // Список идентификаторов купленных бонусов, см /api/store/bonus/list
        icon: number; // Идентификатор активной иконки, см /api/icon/list
        subscriptions: number[]; // Список идентификаторов стримеров на которых подписан пользователь
    };
    parentId: number; // Идентификатор сообщения родителя
}