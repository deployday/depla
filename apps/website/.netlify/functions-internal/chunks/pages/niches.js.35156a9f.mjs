import PocketBase from 'pocketbase';

const POCKET = new PocketBase("https://scarce-arm.pockethost.io");

const getApps = async () => {
  POCKET.admins.authWithPassword(
    'contact@sergeylukin.com',
    'axc*pkb-HNP2gru2nwe'
  );
  const records = await POCKET.collection('categories').getFullList({
    sort: '-created',
  });
  return records;
};

async function get() {
  const apps = await getApps();
  return new Response(JSON.stringify({ apps }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export { get };
