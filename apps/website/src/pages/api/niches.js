import { POCKET } from '../../services/PocketBase.ts';

const getApps = async () => {
  POCKET.admins.authWithPassword(
    'contact@sergeylukin.com',
    'axc*pkb-HNP2gru2nwe' // @TODO you didn't see this, will replace with ENV soon
  );
  const records = await POCKET.collection('categories').getFullList({
    sort: '-created',
  });
  return records;
};

export async function get() {
  const apps = await getApps();
  return new Response(JSON.stringify({ apps }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
