class CarouselMaker{

  options: any;
  root: HTMLDivElement;
  containerChildren: HTMLDivElement[];
  container: HTMLDivElement;
  nbrSlide: number;
  currentItem: number=0;
  timer: number;
  ratio: number;
  prevButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  constructor(element: HTMLDivElement,options: {} = {}){
    this.root = element;
    this.options = Object['assign']({},{
      nbrItemVisible: 3,
      nbrElemtToSlide: 1,
      loop: true,
      interval: 5000
    },options)
  }

  init(): void{
    this.container = (<HTMLDivElement>this.root.firstElementChild) ;
    this.containerChildren = [].slice.call(this.container.children);
    this.nbrSlide = this.containerChildren.length;
    this.ratio = this.nbrSlide / this.options.nbrItemVisible;
    const itemWidth = 100 * (this.options.nbrItemVisible/ this.ratio);
    const childEq = (100 / this.options.nbrItemVisible) / this.ratio;

    /** Style Initiation  */
    this.setWidth(this.container,this.ratio * 100)
    this.containerChildren.map(child => {
      this.setWidth(child,childEq);
    });

    /** Control buttons */
    this.prevButton = this.htmlElementCreator('button', this.root, "prevButton", "navCarrousel");
    this.prevButton.innerText = "Prev";
    this.nextButton = this.htmlElementCreator('button', this.root, "nextButton", "navCarrousel");
    this.nextButton.innerText = "Next";

    /** EventListener on navigation Click */
    this.prevButton.addEventListener('click', () =>{
      this.prev();
      this.play();
      },false);
    this.nextButton.addEventListener('click', () =>{
      this.next();
      this.play();
      },false);

    if(this.options.loop === true){
      this.prevButton.classList.add('hidden');
    }

    this.play();
  }
  setWidth(elem: HTMLDivElement, equation: number): void{
    elem.style.width = equation + "%";
  }

  htmlElementCreator(elementType: string, container: any, id?: string, className? :string): any {
    const element = document.createElement(elementType);
    element.setAttribute("id", id);
    element.setAttribute("class", className);
    container.appendChild(element);
    return (<HTMLElement>element);
  }

  hideElement(element: any): void{
    if(element.classList.contains('hidden'))
      return;
    element.classList.add('hidden');
  }

  showElement(element: any): void{
    if(element.classList.contains('hidden') === false)
      return;
    element.classList.remove('hidden');
  }

  gotoSlide = (index:number) => {
    if(index < 0){
      index = this.nbrSlide - this.options.nbrItemVisible;
    }else if(index >= this.nbrSlide || (this.containerChildren[this.currentItem + this.options.nbrItemVisible] === undefined)&&index > this.currentItem){
      index = 0;
    }
    this.currentItem = index;
    if(this.options.loop == false){
      return;
    }

    (index===0)? this.hideElement(this.prevButton): this.showElement(this.prevButton);
    (this.containerChildren[this.currentItem + this.options.nbrItemVisible] == undefined)? this.hideElement(this.nextButton): this.showElement(this.nextButton);

    const translateX = index * (-100 / this.nbrSlide);
    this.container.style.transform = 'translate3d(' + translateX + '%,0,0)';
  }

  prev = (): void => {
    this.gotoSlide(this.currentItem - this.options.nbrElemtToSlide);
  }

  next = (): void =>{
    this.gotoSlide(this.currentItem + this.options.nbrElemtToSlide);
  }

  play = (): void =>{
    this.stop();
    this.timer = setInterval(this.next,this.options.interval);
  }

  stop(){
    window.clearInterval(this.timer)
  }
}


/** Carousel Initialization */
document.addEventListener('DOMContentLoaded',function (){
  let carrouselToSet: HTMLDivElement = <HTMLDivElement>document.querySelector('#carrousel');
  var myCarrousel = new CarouselMaker(carrouselToSet,{
    nbrItemVisible: 3,
    nbrElemtToSlide: 1,
    loop: true,
    interval: 5000
  });
  myCarrousel.init();
});
