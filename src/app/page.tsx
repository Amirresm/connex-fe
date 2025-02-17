import { Button } from "@mui/joy";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex">
      <Link href="/upload" passHref>
        <Button component="a">Button Link</Button>
      </Link>
    </div>
  );
}
