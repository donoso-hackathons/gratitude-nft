import { Component, ComponentFactoryResolver, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
  selector: 'barrio-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  videoComp: any;
  constructor(  
    private injector: Injector,
    private cfr: ComponentFactoryResolver,) { }

    @ViewChild('video', {read: ViewContainerRef})video: ViewContainerRef;


    seeMore(){
      let target = document.getElementById('seeMore');
      if (window.innerWidth > 576){
      target.scrollIntoView({ behavior: "smooth",block: 'center'  });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }

  async showVideo(url: string)  {

  //   if (this.videoComp === undefined) {
  // //  const {VideoModalComponent} = await import('../../shared/video-modal/video-modal.component');
  //   const factory = this.cfr.resolveComponentFactory(VideoModalComponent);
  //   const n =  this.video.createComponent(factory);
  //   this.videoComp = n.instance;
  //   }
  //   this.videoComp.passedUrl = url;
  //   this.videoComp.ngOnChanges();
  
  }

  ngOnInit() {
  }

}
