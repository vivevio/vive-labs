import {
    createBrowserRouter,
} from "react-router-dom";

import MediaMixer from "@/pages/media-mixer";
import KwaiciIndex from "@/pages/kwaici";
import VideoRecording from "@/pages/kwaici/video-recording";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello world!</div>,
    },
    {
        path: "/media-mixer",
        element: <MediaMixer />,
    },
    {
        path: "/kwaici",
        element: <KwaiciIndex />,
    },
    {
        path: "/video-recording",
        element: <VideoRecording />,
    },
]);

export default Router
