import { astroToReka } from './depla-ast';

describe('astro', () => {
  it('works', () => {
    const expected = `const App = () => {
  return (
    <div class="grid grid-cols-2 row-gap-8 md:grid-cols-4">
      <div
        class="text-center md:border-r md:last:border-none dark:md:border-slate-500 mb-12 md:mb-0"
        @if={items}>
        <div class="text-[2.6rem] font-bold lg:text-5xl xl:text-6xl text-primary dark:text-blue-600 font-heading"><text value="Value" /></div>
        <p class="text-sm font-medium tracking-widest text-gray-800 dark:text-slate-400 uppercase lg:text-base"><text value="Name" /></p>
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

  it('reads modern ES6 syntax like `obj?.prop` notation', () => {
    const astroSource = `links?.length`;
    const expected = `links?.length`;

    expect(astroToReka(astroSource).source).toEqual(expected);
  });

  it('reads fragments', () => {
    const astroSource = `<>asdad</>`;
    const expected = `<Fragment><text value="asdad" /></Fragment>`;

    expect(astroToReka(astroSource).source).toEqual(expected);
  });

  it('reads complex stuff', () => {
    const astroSource = `<div><Icon name={item.icon ? item.icon : 'something-else'} /></div>`;
    const expected = `<div><Icon name={item.icon ? item.icon : 'something-else'} /></div>`;

    expect(astroToReka(astroSource).source).toEqual(expected);
  });

  it('reads more complex stuff', () => {
    const astroSource = `<li class="link-card">
<a href={href}>
  <h2>
    {title}
    <span>hey</span>
  </h2>
  <p>
    {body}
  </p>
  </a>
</li>`;
    const expected = `<li class="link-card">
<a href={href}>
  <h2>
    <text value={title} />
    <span><text value="hey" /></span>
  </h2>
  <p>
    <text value={body} />
  </p>
  </a>
</li>`;

    expect(astroToReka(astroSource).source).toEqual(expected);
  });

  it('transforms href', () => {
    const expected = `<div>
      <a href={"/"}></a>
      <div class="mx-auto px-6 sm:px-6 max-w-3xl pt-8 md:pt-4 pb-12 md:pb-20">
        <a class="btn btn-ghost px-3 md:px-3" href="">
          <Icon name="tabler:chevron-left" class="w-5 h-5 mr-1 -ml-1.5" /><text value="Back to Blog" /></a>
      </div>
    </div>`

    const a = `<div>
      <a href={'/'}></a>
      <div class="mx-auto px-6 sm:px-6 max-w-3xl pt-8 md:pt-4 pb-12 md:pb-20">
        <a class="btn btn-ghost px-3 md:px-3" href={''}>
          <Icon name="tabler:chevron-left" class="w-5 h-5 mr-1 -ml-1.5" />
          Back to Blog
        </a>
      </div>
    </div>`;

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('transforms simple template', () => {
    const expected = `<div><a href={"/"}></a></div>`

    const t = `
<PageLayout meta={meta}>
  <div>asdsad</div>
</PageLayout>
`;

    try {
      const res = astroToReka(t)
      // expect(res.source).toEqual(expected);
    } catch(e) {
      console.log('asdasdasdasdasdasasdad', e)
    }
  });

  it('removes comments blocks', () => {
    const expected = `<div></div>`

    const a = `<div>{/* bla bla bla */}</div>`;

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('extracts texxt', () => {
    const expected = `<footer><p><text value="Hello there" /></p></footer>`

    const a = `<footer><p>Hello there</p></footer>`

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('extracts texxt in weird spans', () => {
    const expected = `<div>
  <span class="dark:text-white text-slate-700"><text value={logoCopy1} /></span><span
    class="text-accent"><text value={logoCopy2} /></span
  >
  </div>`;

    const a = `<div>
  <span class="dark:text-white text-slate-700">{logoCopy1}</span><span
    class="text-accent">{logoCopy2}</span
  >
  </div>`;

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('extracts texxt in more weird elements', () => {
    const expected = `<Headline
      subtitle="A statically generated blog example with news, tutorials, resources and other interesting content related to AstroWind"
    ><text value="The Blog" /></Headline>`;

    const a = `
    <Headline
      subtitle="A statically generated blog example with news, tutorials, resources and other interesting content related to AstroWind"
    >
      The Blog
    </Headline>`

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('transforms logical expressions to ternary', () => {
    const a = `<ul>
<li>{foo || 'fallback'}</li>
<li>{yay && yoy}</li>
<li>{a || b || c}</li>
<li>{(someValue || someOtherValue) && <p>Hey</p>}</li>
</ul>`

    const expected = `<ul>
<li>{foo ? foo : 'fallback'}</li>
<li>{yay ? yoy : ""}</li>
<li>{a ? a : b ? b : c}</li>
<li><p @if={someValue ? someValue : someOtherValue}><text value="Hey" /></p></li>
</ul>`;

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('it uses double quotes', () => {
    const a = "<p class={`foo bar`}></p>"
    const expected = `<p class="foo bar"></p>`
    expect(astroToReka(a).source).toEqual(expected);
  });

  it('transforms if expression with brackets', () => {
    const a = `<div>
      {
        allPostsText && allPostsLink && (
          <a
            class="text-muted dark:text-slate-400 hover:text-primary transition ease-in duration-200 block mb-6 lg:mb-0"
            href={allPostsLink}
          >
            {allPostsText} »
          </a>
        )
      }
  </div>`
    const expected = `<div>
      <a
        class="text-muted dark:text-slate-400 hover:text-primary transition ease-in duration-200 block mb-6 lg:mb-0"
        href={allPostsLink}
        @if={allPostsText ? allPostsLink : ""}>
        <text value={allPostsText} /><text value="»" /></a>
  </div>`

    expect(astroToReka(a).source).toEqual(expected);
  });


  it('transforms negative expressions', () => {
    const a = `<h3>
    {
      BLOG.disabled && (
        <a
          href={postLink}
          class="hover:text-primary dark:hover:text-blue-700  transition ease-in duration-200"
        >
          {post.title}
        </a>
      )
    }
    {!BLOG.disabled && <span>post.title</span>}
  </h3>`

    const expected = `<h3>
    <a
      href={postLink}
      class="hover:text-primary dark:hover:text-blue-700  transition ease-in duration-200"
      @if={BLOG.disabled}>
      <text value={post.title} />
    </a>
    <span @if={!BLOG.disabled}><text value="post.title" /></span>
  </h3>`

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('transforms footer', () => {
    const a = `<div><footer
  class:list={[
    { dark: theme === 'dark' },
    'relative border-t border-gray-200 dark:border-slate-800',
  ]}
>
  <div
    class="dark:bg-dark absolute inset-0 pointer-events-none"
    aria-hidden="true"
  >
  </div>
</footer></div>`;

    const expected = `<div><footer
  @classList={{
    "dark": true,
    "relative": true,
    "border-t": true,
    "border-gray-200": true,
    "dark:border-slate-800": true
  }}
>
  <div class="dark:bg-dark absolute inset-0 pointer-events-none">
  </div>
</footer></div>`;

    expect(astroToReka(a).source).toEqual(expected);
  });

  it('transforms header', () => {
    let result;
try {
    const a = `<header
  class:list={[
    { 'position-sticky': isSticky, relative: !isSticky },
    'border-t border-gray-200 dark:border-slate-800',
  ]}
 />`;
  result = astroToReka(a);
} catch(e) {
  console.log('AstroToReka Header transform err', e);
}


    const expected = `<header
  @classList={{
    "position-sticky": true,
    "relative": true,
    "border-t": true,
    "border-gray-200": true,
    "dark:border-slate-800": true
  }}
 />`;

    expect(result?.source).toEqual(expected);
  });

  it('quotes', () => {
    let result;
try {
    const a = `<header items={[{ foo: 'bar "hey" sample' }]} />`;
  result = astroToReka(a);
} catch(e) {
  console.log('AstroToReka quotes transform err', e);
}


    const expected = `<header items={[{ foo: 'bar "hey" sample' }]} />`;

    expect(result?.source).toEqual(expected);
  });
});
