import * as React from "react";
import Image from "next/image";
export default function Page(): React.ReactElement {
    return <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src={"/carousel/carouselPlaceholder.png"} alt="Todo Placeholder Image" width={400} height={400}/>
    </div>;
}