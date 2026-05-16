const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

const image = new Image();
image.src = "portrait.png";

const particles = [];
const bgStars = [];

const TOTAL_PARTICLES = 3500;

class Particle{

    constructor(x,y,color){

        this.x = Math.random() * w;
        this.y = Math.random() * h;

        this.tx = x;
        this.ty = y;

        this.color = color;

        this.size = Math.random() * 1.8 + 0.5;

        this.speed = Math.random() * 0.02 + 0.008;

        this.opacity = Math.random();

        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
    }

    update(){

        this.x += (this.tx - this.x) * this.speed;
        this.y += (this.ty - this.y) * this.speed;

        this.opacity += (1 - this.opacity) * 0.02;
    }

    draw(){

        ctx.beginPath();

        ctx.fillStyle = `rgba(${this.color.r},
                               ${this.color.g},
                               ${this.color.b},
                               ${this.opacity})`;

        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color.r},
                                ${this.color.g},
                                ${this.color.b},
                                0.8)`;

        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);

        ctx.fill();
    }
}

function createBackgroundStars(){

    for(let i=0;i<500;i++){

        bgStars.push({
            x:Math.random()*w,
            y:Math.random()*h,
            size:Math.random()*2,
            opacity:Math.random()
        });
    }
}

function drawBackground(){

    ctx.fillStyle = "#020611";
    ctx.fillRect(0,0,w,h);

    bgStars.forEach(s=>{

        ctx.beginPath();

        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;

        ctx.arc(s.x,s.y,s.size,0,Math.PI*2);

        ctx.fill();
    });
}

function connectParticles(){

    for(let i=0;i<particles.length;i+=3){

        for(let j=i+1;j<particles.length;j+=6){

            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const dist = Math.sqrt(dx*dx + dy*dy);

            if(dist < 22){

                ctx.beginPath();

                ctx.strokeStyle = `rgba(255,255,255,${0.08})`;

                ctx.lineWidth = 0.5;

                ctx.moveTo(a.x,a.y);
                ctx.lineTo(b.x,b.y);

                ctx.stroke();
            }
        }
    }
}

function createPortrait(){

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    const scale = Math.min(w/image.width,h/image.height) * 0.75;

    const iw = image.width * scale;
    const ih = image.height * scale;

    tempCanvas.width = iw;
    tempCanvas.height = ih;

    tempCtx.drawImage(image,0,0,iw,ih);

    const data = tempCtx.getImageData(0,0,iw,ih).data;

    particles.length = 0;

    for(let y=0;y<ih;y+=2){

        for(let x=0;x<iw;x+=2){

            const index = (y*iw + x) * 4;

            const r = data[index];
            const g = data[index+1];
            const b = data[index+2];
            const a = data[index+3];

            const brightness = (r+g+b)/3;

            if(a > 40 && brightness > 20){

                particles.push(

                    new Particle(

                        x + (w-iw)/2,
                        y + (h-ih)/2,

                        {r,g,b}
                    )
                );
            }
        }
    }
}

function animate(){

    requestAnimationFrame(animate);

    drawBackground();

    connectParticles();

    particles.forEach(p=>{

        p.update();
        p.draw();
    });
}

image.onload = ()=>{

    createBackgroundStars();

    createPortrait();

    animate();
};
