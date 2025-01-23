import { RouteDurableObject, useWebsocket } from "@orange-js/orange";
import { useState } from "react";

const names = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Isaac",
  "Judy",
  "Karl",
  "Larry",
  "Mallory",
  "Nancy",
  "Oscar",
  "Peggy",
  "Quentin",
  "Rupert",
];

export class ChatDurableObject extends RouteDurableObject<Env> {
  static id = "chatroom";

  async webSocketConnect(
    client: WebSocket,
    server: WebSocket
  ): Promise<Response> {
    const current = this.ctx.getWebSockets().length;
    const name = names[Math.floor(Math.random() * names.length)];

    this.ctx.getWebSockets().forEach((ws) => ws.send(`${name} joined.`));

    server.serializeAttachment({ name });
    this.ctx.acceptWebSocket(server);

    server.send(`Welcome, ${name}! There are ${current} people here.`);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(client: WebSocket, message: string): Promise<void> {
    if (message.length === 0 || message.length > 1000) {
      client.send("Message must be between 1 and 1000 characters.");
      return;
    }
    const { name } = client.deserializeAttachment();
    this.ctx.getWebSockets().forEach((ws) => ws.send(`${name}: ${message}`));
  }

  async webSocketClose(client: WebSocket): Promise<void> {
    const { name } = client.deserializeAttachment();
    this.ctx.getWebSockets().forEach((ws) => ws.send(`${name} left.`));
  }
}

const Message: React.FC<{ content: string }> = ({ content }) => (
  <div className="border-l border-lime-500 p-2">
    <p>{content}</p>
  </div>
);

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const send = useWebsocket((msg) =>
    setMessages((existing) => [...existing, msg.data])
  );

  return (
    <div className="flex flex-col items-center w-screen h-screen p-8">
      <div className="flex flex-col justify-center gap-1 mt-12">
        {messages.map((msg, i) => (
          <Message key={i} content={msg} />
        ))}
        <input
          placeholder="Type a message..."
          className="bg-gray-100 border border-gray-400 rounded p-2 mt-4"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.length > 0) {
              send(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
