import { useRouter } from 'next/router';
import RoomPage from '../../components/Pages/RoomPage';

export default function Room() {
  const router = useRouter();
  const { id } = router.query;

  return <RoomPage roomId={id} />;
}