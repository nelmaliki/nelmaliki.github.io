import * as React from "react";
import Image from "next/image";
export default function Page(): React.ReactElement {
return (
  <div className="flex justify-center items-center">
    <Image
      src={"/carousel/carouselPlaceholder.png"}
      alt="Todo Placeholder Image"
      width={400}
      height={400}
    />
  </div>
);
}

