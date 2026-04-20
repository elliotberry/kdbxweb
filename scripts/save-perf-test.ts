import { Credentials, Kdbx, ProtectedValue } from '../lib';

const credentials = new Credentials(ProtectedValue.fromString(''));

const db = Kdbx.create(credentials, 'test');
db.upgrade();

const time = process.hrtime();
db.save()
    .then(() => {
        const diff = process.hrtime(time);
        const NS_PER_SEC = 1e9;
        const seconds = (diff[0] + diff[1] / NS_PER_SEC).toFixed(3);
        console.log(`Done in ${seconds} seconds`);
    })
    .catch((e) => console.error(e));
