import { redirect } from 'next/navigation';

// /math → redirect to the Math topic page
export default function MathPage() {
    redirect('/topic/topic-math');
}
