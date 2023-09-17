import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';
import {
  findUser,
  isLink,
  isLogged,
  logout,
  link,
  name,
} from '../services/UsersService';
import { App, getUserApps } from '../services/AppsService';
// import PaperPlane from "./PaperPlane";
import { POCKET } from '../services/PocketBase';

export default function Apps() {
  // const [message, setMessage] = createSignal<string>("");
  const [apps, setApps] = createSignal<App[]>([]);
  // const [active, setActive] = createSignal<Chat | null>(null);
  // const [subId, setSubId] = createSignal<string>("");

  onMount(async () => {
    if (!isLogged()) {
      window.location.href = '/auth';
      return;
    }
    setApps(await getUserApps(link()));
  });

  // createEffect(() => {
  //   if (!active()) return;
  //
  //   if (subId()) {
  //     POCKET.collection("chats").unsubscribe(subId());
  //   }
  //   setSubId(active()!.id);
  //
  //   POCKET.collection("chats").subscribe<Chat>(subId(), ev => {
  //     setActive(ev.record);
  //   });
  // });

  // async function send() {
  //   if ((!active() || isLink(message())) && message() !== link()) {
  //     const user = await findUser(message());
  //     if (!!user) {
  //       const record = await createChat(link(), name(), user.link, user.name);
  //       setActive(record);
  //       setChats([...chats(), record]);
  //     }
  //   }
  //
  //   if (!!active()) {
  //     const messages = [...active()!.messages, {
  //       message: message(),
  //       author: link(),
  //       created: new Date().getDate()
  //     }] as Message[];
  //     setActive({
  //       ...active()!,
  //       messages
  //     });
  //     updateChat(active()!.id, messages);
  //   }
  //
  //   setMessage("");
  // }

  // function onKeyUp(ev: KeyboardEvent) {
  //   if (ev.key === "Enter") {
  //     send();
  //   }
  // }

  return (
    <section class="chat">
      <button onClick={logout}>Logout</button>
      <div>
        <aside>
          <ul>
            <For each={apps()}>
              {(app, i) => (
                <li>
                  <button class="bubble">{app.name}</button>
                </li>
              )}
            </For>
          </ul>
        </aside>

        <main>
          <ul class="messages">{'asdads'}</ul>
          <footer></footer>
        </main>
      </div>
    </section>
  );
}
