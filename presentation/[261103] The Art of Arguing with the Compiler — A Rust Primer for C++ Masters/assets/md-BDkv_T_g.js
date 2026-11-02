import{Ct as e,D as t,K as n,S as r,T as i,V as a,b as o,et as s,k as c,tt as l,w as u,xt as d,y as f,yt as p}from"./modules/shiki-CzZ4vpcs.js";import{nt as m,rt as h}from"./index-qKehQwG2.js";import{t as g}from"./_plugin-vue_export-helper-BDNMzG2s.js";import{A as _,E as v,k as y}from"./modules/unplugin-icons-BW0EFmOL.js";import{t as b}from"./Hl-DeFSVzor.js";import{t as x}from"./Term-B-0lEuqb.js";import{t as S}from"./slidev/CodeBlockWrapper-ByJ5qKUg.js";import{t as C}from"./slidev/default-TGlljFV-.js";var w=`In file included from shape.cpp:1:
/usr/include/c++/16/variant: In instantiation of ‘constexpr bool std::__detail::__variant::__check_visitor_results(std::index_sequence<_Ind ...>) [with _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variant = std::variant<Circle, Rect, Triangle>&; long unsigned int ..._Idxs = {0, 1, 2}; std::index_sequence<_Ind ...> = std::integer_sequence<long unsigned int, 0, 1, 2>]’:
/usr/include/c++/16/variant:1972:44:   required from ‘constexpr std::__detail::__variant::__visit_result_t<_Visitor, _Variants ...> std::visit(_Visitor&&, _Variants&& ...) [with _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variants = {variant<Circle, Rect, Triangle>&}; __detail::__variant::__visit_result_t<_Visitor, _Variants ...> = double]’
 1971 |           constexpr bool __visit_rettypes_match = __detail::__variant::
      |                                                   ~~~~~~~~~~~~~~~~~~~~~
 1972 |             __check_visitor_results<_Visitor, _Vp>(
      |             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^
 1973 |               make_index_sequence<variant_size_v<remove_reference_t<_Vp>>>());
      |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
shape.cpp:8:20:   required from here
    8 |   return std::visit(overloaded{
      |          ~~~~~~~~~~^~~~~~~~~~~~
    9 |     [](Circle c) { return 3.14*c.r*c.r; },
      |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   10 |     [](Rect r)   { return r.w*r.h; },
      |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   11 |   }, s);
      |   ~~~~~             
/usr/include/c++/16/variant:1145:14: error: no type named ‘type’ in ‘struct std::invoke_result<overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >, Triangle&>’
 1145 |       return __same_types<
      |              ^~~~~~~~~~~~~
 1146 |         invoke_result_t<_Visitor, __get_t<_Idxs, _Variant>>...
      |         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 1147 |         >;
      |         ~     
/usr/include/c++/16/variant: In instantiation of ‘constexpr std::__detail::__variant::__visit_result_t<_Visitor, _Variants ...> std::visit(_Visitor&&, _Variants&& ...) [with _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variants = {variant<Circle, Rect, Triangle>&}; __detail::__variant::__visit_result_t<_Visitor, _Variants ...> = double]’:
shape.cpp:8:20:   required from here
    8 |   return std::visit(overloaded{
      |          ~~~~~~~~~~^~~~~~~~~~~~
    9 |     [](Circle c) { return 3.14*c.r*c.r; },
      |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   10 |     [](Rect r)   { return r.w*r.h; },
      |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   11 |   }, s);
      |   ~~~~~             
/usr/include/c++/16/variant:1976:29: error: non-constant condition for static assertion
 1976 |               static_assert(__visit_rettypes_match,
      |                             ^~~~~~~~~~~~~~~~~~~~~~
/usr/include/c++/16/variant:1979:15: error: return-statement with no value, in function returning ‘std::__detail::__variant::__visit_result_t<overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >, std::variant<Circle, Rect, Triangle>&>’ {aka ‘double’} [-fpermissive]
 1979 |               return;
      |               ^~~~~~
/usr/include/c++/16/variant: In instantiation of ‘static constexpr decltype(auto) std::__detail::__variant::__gen_vtable_impl<std::__detail::__variant::_Multi_array<_Result_type (*)(_Visitor, _Variants ...)>, std::integer_sequence<long unsigned int, __indices ...> >::__visit_invoke(_Visitor&&, _Variants ...) [with _Result_type = std::__detail::__variant::__deduce_visit_result<double>; _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >&&; _Variants = {std::variant<Circle, Rect, Triangle>&}; long unsigned int ...__indices = {2}]’:
/usr/include/c++/16/variant:1921:5:   required from ‘constexpr decltype(auto) std::__do_visit(_Visitor&&, _Variants&& ...) [with _Result_type = __detail::__variant::__deduce_visit_result<double>; _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variants = {variant<Circle, Rect, Triangle>&}]’
 1921 |                   _GLIBCXX_VISIT_CASE(2)
      |                   ^~~~~~~~~~~~~~~~~~~
/usr/include/c++/16/variant:1982:34:   required from ‘constexpr std::__detail::__variant::__visit_result_t<_Visitor, _Variants ...> std::visit(_Visitor&&, _Variants&& ...) [with _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variants = {variant<Circle, Rect, Triangle>&}; __detail::__variant::__visit_result_t<_Visitor, _Variants ...> = double]’
 1982 |             return std::__do_visit<_Tag>(
      |                    ~~~~~~~~~~~~~~~~~~~~~^
 1983 |               std::forward<_Visitor>(__visitor),
      |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 1984 |               static_cast<_Vp>(__variants)...);
      |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
shape.cpp:8:20:   required from here
    8 |   return std::visit(overloaded{
      |          ~~~~~~~~~~^~~~~~~~~~~~
    9 |     [](Circle c) { return 3.14*c.r*c.r; },
      |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   10 |     [](Rect r)   { return r.w*r.h; },
      |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   11 |   }, s);
      |   ~~~~~             
/usr/include/c++/16/variant:1071:31: error: no matching function for call to ‘__invoke(overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >, Triangle&)’
 1071 |           return std::__invoke(std::forward<_Visitor>(__visitor),
      |                  ~~~~~~~~~~~~~^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 1072 |               __element_by_index_or_cookie<__indices>(
      |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 1073 |                 std::forward<_Variants>(__vars))...);
      |                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  • there is 1 candidate
In file included from /usr/include/c++/16/variant:48:
    • candidate 1: ‘template<class _Callable, class ... _Args> constexpr typename std::__invoke_result<_Functor, _ArgTypes>::type std::__invoke(_Callable&&, _Args&& ...)’
      /usr/include/c++/16/bits/invoke.h:92:5:
         92 |     __invoke(_Callable&& __fn, _Args&&... __args)
            |     ^~~~~~~~
      • template argument deduction/substitution failed:
        • /usr/include/c++/16/bits/invoke.h: In substitution of ‘template<class _Callable, class ... _Args> constexpr typename std::__invoke_result<_Functor, _ArgTypes>::type std::__invoke(_Callable&&, _Args&& ...) [with _Callable = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Args = {Triangle&}]’:
        • required from ‘static constexpr decltype(auto) std::__detail::__variant::__gen_vtable_impl<std::__detail::__variant::_Multi_array<_Result_type (*)(_Visitor, _Variants ...)>, std::integer_sequence<long unsigned int, __indices ...> >::__visit_invoke(_Visitor&&, _Variants ...) [with _Result_type = std::__detail::__variant::__deduce_visit_result<double>; _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >&&; _Variants = {std::variant<Circle, Rect, Triangle>&}; long unsigned int ...__indices = {2}]’
          /usr/include/c++/16/variant:1071:24:   
           1071 |           return std::__invoke(std::forward<_Visitor>(__visitor),
                |                  ~~~~~~~~~~~~~^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           1072 |               __element_by_index_or_cookie<__indices>(
                |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           1073 |                 std::forward<_Variants>(__vars))...);
                |                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        • required from ‘constexpr decltype(auto) std::__do_visit(_Visitor&&, _Variants&& ...) [with _Result_type = __detail::__variant::__deduce_visit_result<double>; _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variants = {variant<Circle, Rect, Triangle>&}]’
          /usr/include/c++/16/variant:1921:5:   
           1921 |                   _GLIBCXX_VISIT_CASE(2)
                |                   ^~~~~~~~~~~~~~~~~~~
        • required from ‘constexpr std::__detail::__variant::__visit_result_t<_Visitor, _Variants ...> std::visit(_Visitor&&, _Variants&& ...) [with _Visitor = overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >; _Variants = {variant<Circle, Rect, Triangle>&}; __detail::__variant::__visit_result_t<_Visitor, _Variants ...> = double]’
          /usr/include/c++/16/variant:1982:34:   
           1982 |             return std::__do_visit<_Tag>(
                |                    ~~~~~~~~~~~~~~~~~~~~~^
           1983 |               std::forward<_Visitor>(__visitor),
                |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           1984 |               static_cast<_Vp>(__variants)...);
                |               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        • required from here
          shape.cpp:8:20:   
              8 |   return std::visit(overloaded{
                |          ~~~~~~~~~~^~~~~~~~~~~~
              9 |     [](Circle c) { return 3.14*c.r*c.r; },
                |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             10 |     [](Rect r)   { return r.w*r.h; },
                |     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             11 |   }, s);
                |   ~~~~~             
        • error: no type named ‘type’ in ‘struct std::__invoke_result<overloaded<area(Shape)::<lambda(Circle)>, area(Shape)::<lambda(Rect)> >, Triangle&>’
          /usr/include/c++/16/bits/invoke.h:92:5:
             92 |     __invoke(_Callable&& __fn, _Args&&... __args)
                |     ^~~~~~~~
`,T={class:`wall`},E=g(t({__name:`WallOfErrors`,setup(t){let{$slidev:n,$nav:i,$clicksContext:o,$clicks:s,$page:c,$renderContext:l,$frontmatter:u}=h();return(t,n)=>(a(),r(`pre`,T,e(p(w)),1))}}),[[`__scopeId`,`data-v-de5921c3`]]),D={class:`grid gap-5 items-start`,style:{"grid-template-columns":`auto 1fr`}},O={class:`label mb-2 rust`},k={class:`mt-2`},A={class:`flex flex-col gap-3`},j={class:`label mb-2`},M={class:`label mb-2`},N={__name:`slides.md__slidev_17`,setup(e){let{$slidev:t,$nav:g,$clicksContext:w,$clicks:T,$page:N,$renderContext:P,$frontmatter:F}=h();return w.setup(),(e,t)=>{let h=_,g=S,w=x,T=v,N=b,P=y,I=E,L=n(`click`);return a(),o(C,d(c(p(m)(p(F),16))),{default:s(()=>[t[10]||=f(`h1`,null,`Exhaustive Match`,-1),f(`div`,D,[f(`div`,null,[f(`div`,O,[i(h,{class:`ic`,style:{color:`var(--rust)`}}),t[0]||=u(` Rust`,-1)]),i(g,{title:``,ranges:[]},{default:s(()=>[...t[1]||=[f(`pre`,{class:`shiki shiki-themes one-dark-pro one-dark-pro slidev-code`,style:{"--shiki-dark":`#abb2bf`,"--shiki-light":`#abb2bf`,"--shiki-dark-bg":`#282c34`,"--shiki-light-bg":`#282c34`}},[f(`code`,{class:`language-rust`},[f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#C678DD`,"--shiki-light":`#C678DD`}},`enum`),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},` Shape`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` {`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`    Circle`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` { `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`r`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`: `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`f64`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` },`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`    Rect`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` { `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`w`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`: `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`f64`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`, `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`h`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`: `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`f64`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` },`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`    Triangle`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` { `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`b`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`: `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`f64`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`, `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`h`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`: `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`f64`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` }, `),f(`span`,{style:{"--shiki-dark":`#7F848E`,"--shiki-dark-font-style":`italic`,"--shiki-light":`#7F848E`,"--shiki-light-font-style":`italic`}},`// new`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`}`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#C678DD`,"--shiki-light":`#C678DD`}},`fn`),f(`span`,{style:{"--shiki-dark":`#61AFEF`,"--shiki-light":`#61AFEF`}},` area`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`(`),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`s`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`: `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`Shape`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`) -> `),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`f64`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` {`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#C678DD`,"--shiki-light":`#C678DD`}},`    match`),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},` s`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` {`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`        Shape`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`::`),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`Circle`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` { `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`r`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` } => `),f(`span`,{style:{"--shiki-dark":`#D19A66`,"--shiki-light":`#D19A66`}},`3.14`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` * `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`r`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` * `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`r`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`,`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`        Shape`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`::`),f(`span`,{style:{"--shiki-dark":`#E5C07B`,"--shiki-light":`#E5C07B`}},`Rect`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` { `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`w`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`, `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`h`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` } => `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`w`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},` * `),f(`span`,{style:{"--shiki-dark":`#E06C75`,"--shiki-light":`#E06C75`}},`h`),f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`,`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`    }`)]),u(`
`),f(`span`,{class:`line`},[f(`span`,{style:{"--shiki-dark":`#ABB2BF`,"--shiki-light":`#ABB2BF`}},`}`)])])],-1)]]),_:1}),l((a(),r(`div`,k,[i(w,{title:`rustc`},{default:s(()=>[...t[2]||=[f(`pre`,null,[f(`span`,{class:`t-err`},`error[E0004]`),u(": non-exhaustive patterns:\n  `Shape::Triangle { .. }` not covered")],-1)]]),_:1})])),[[L,1]])]),f(`div`,A,[l((a(),r(`div`,null,[f(`div`,j,[i(T,{class:`ic`}),t[4]||=u(` C — `,-1),i(N,{lang:`c`},{default:s(()=>[...t[3]||=[u(`switch`,-1)]]),_:1})]),i(w,{title:`gcc -Wall`},{default:s(()=>[...t[5]||=[f(`pre`,null,[u(`shape.c:4:3: `),f(`span`,{class:`t-warn`},`warning`),u(`: enumeration value
  ‘TRIANGLE’ not handled in switch [-Wswitch]
`),f(`span`,{class:`t-ln`},`    4 |`),u(`   switch (s.kind) {
`),f(`span`,{class:`t-ln`},`      |`),u(`   `),f(`span`,{class:`t-warn`},`^~~~~~`)],-1)]]),_:1})])),[[L,2]]),l((a(),r(`div`,null,[f(`div`,M,[i(P,{class:`ic`}),t[7]||=u(` C++ — `,-1),i(N,{lang:`cpp`},{default:s(()=>[...t[6]||=[u(`std::visit`,-1)]]),_:1}),t[8]||=u(),t[9]||=f(`span`,{class:`muted`},`· 110 lines`,-1)]),i(w,{title:`g++ -std=c++20`},{default:s(()=>[i(I)]),_:1})])),[[L,3]])])])]),_:1},16)}}};export{N as default};