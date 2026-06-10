
import fs from "fs";
import path from "path";

export default function Page() {
    const dir = path.join(process.cwd(), "public/gallery");

    let images = [];

    try {
        const files = fs.readdirSync(dir);
        images = files.map((file) => `/gallery/${file}`);
    } catch (error) {
        console.log("Gallery folder missing");
    }

    return (
        <div className="min-h-screen bg-stone-50 px-4 py-20">
            <div className="max-w-7xl mx-auto text-center">
<h1 className=" text-4xl md:text-5xl font-semibold text-slate-900">Our Gallery</h1>
<p className="mt-4 text-slate-600 max-w-xl mx-auto">Explore our campus, labs, and student life through moments captured.</p>
            </div>

            <div className="mt-16 max-w-7xl mx-auto grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[220px]">
 {images.map((src , i) => (
    <div
    key={i}
    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${i % 5 === 0 ? "row-span-2 col-span-2" : ""}`}
    >
        <img  src={src} alt="gallery" 
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover: scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t
              from-black/60 via-black/20 to-transparent
              opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="absolute bottom-4 left-4 right-4 text-white
              opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-500">
                <p className="text-sm font-medium">View Image</p>
                <p className="text-xs text-white/80">Click to expand</p>
        </div>
        <div className="absilute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:right-white/30 transition"/>
     </div>
 ))}
            </div>
            {images.length === 0 && (
                <div className="text-center mt-20 text-slate-500">
                     No images found in <span className="font-medium">/public/gallery</span>
                </div>
            )}

        </div>
    )
}