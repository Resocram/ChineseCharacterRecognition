import { useRouter } from 'next/router';
import RoomIdPage from '../../components/Pages/RoomIdPage';

export default function Room() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  return <RoomIdPage roomId={id} />;
}