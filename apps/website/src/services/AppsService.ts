import { POCKET } from './PocketBase';

export interface Post {
  author: string;
  title: string;
  body: string;
  created: number;
}

export interface App {
  id: string;
  category: string;
  name: string;
  heading: string;
  posts: Post[];
}

// export async function createChat(
//   first: string,
//   firstName: string,
//   second: string,
//   secondName: string
// ): Promise<Chat> {
//   return await POCKET.collection('chats').create<Chat>({
//     first,
//     firstName,
//     second,
//     secondName,
//     messages: [],
//   });
// }
//
// export async function updateChat(id: string, messages: Message[]) {
//   return await POCKET.collection('chats').update(id, {
//     messages,
//   });
// }

export async function getUserApps(link: string): Promise<App[]> {
  const result = await POCKET.collection('apps').getList<App>(
    1,
    50,
    (function () {
      return link
        ? {
            filter: `owner.id='${link}'`,
          }
        : undefined;
    })()
  );
  return result.items;
}

export async function getApp(id: string) {
  return await POCKET.collection('apps').getOne(id);
}
