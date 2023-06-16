import { astroToReka } from './depla-ast';

describe('astro', () => {
  it('works', () => {
    const expected = `const App = () => {
  return (
    <div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
      <div
        class="text-center md:border-r md:last:border-none dark:md:border-slate-500 mb-12 md:mb-0"
        @if={items}>
        <div class="text-[2.6rem] font-bold lg:text-5xl xl:text-6xl text-primary dark:text-blue-600 font-heading">
          <text value="Value" />
        </div>
        <p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">
          <text value="Name" />
        </p>
      </div>
    </div>
  );
  }`;

    const astroIf = `
const App = () => {
  return <div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
    {
      items && (
        <div class="text-center md:border-r md:last:border-none dark:md:border-slate-500 mb-12 md:mb-0">
          <div class="text-[2.6rem] font-bold lg:text-5xl xl:text-6xl text-primary dark:text-blue-600 font-heading">
            Value
          </div>
          <p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">
            Name
          </p>
        </div>
      )
    }
  </div>
  }`;

    expect(astroToReka(astroIf).source).toEqual(expected);
  });

  it('converts if and each', () => {
    const expected = `<div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
  <div
    class="text-center md:border-r md:last:border-none dark:md:border-slate-500 mb-12 md:mb-0"
    @each={item in items}>
    <div class="text-[2.6rem] font-bold lg:text-5xl xl:text-6xl text-primary dark:text-blue-600 font-heading">
      <text value={value} />
    </div>
    <p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">
      <text value={name} />
    </p>
  </div>
</div>`;

    const astroMap = `
<div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
  {
    items.map((item) => (
      <div class="text-center md:border-r md:last:border-none dark:md:border-slate-500 mb-12 md:mb-0">
        <div class="text-[2.6rem] font-bold lg:text-5xl xl:text-6xl text-primary dark:text-blue-600 font-heading">
          {value}
        </div>
        <p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base">
          {name}
        </p>
      </div>
    ))
  }
</div>
    `;

    expect(astroToReka(astroMap).source).toEqual(expected);
  });

  it('strips astro attributes', () => {
    const expected = `<div></div>`;

    const astroWithAttribute = `<div set:html={foo}></div>`;

    expect(astroToReka(astroWithAttribute).source).toEqual(expected);
  });

  it('supports logical condition', () => {
    const expected = `<div><div @if={foo}></div></div>`;

    const astroWithAttribute = `<div>{ foo ? <div></div> : '' }</div>`;

    expect(astroToReka(astroWithAttribute).source).toEqual(expected);
  });

  it('extracts <Components />', () => {
    const expected = ['Header', 'Card'];

    const astroWithComponents = `<div><Header><div><Card /></div></Header></div>`;

    expect(astroToReka(astroWithComponents).components).toEqual(expected);
  });
});
