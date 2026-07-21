# Setup

1. Install [Quarto](https://quarto.org/docs/get-started/)
2. Edit `index.qmd`
3. Run `quarto render index.qmd` to generate `index.html`
4. `python -m http.server` and view the presentation at `http://localhost:8000/` on browser

## Note

- `quarto install extension pandoc-ext/diagram` if you need tikz. See [Github](https://github.com/pandoc-ext/diagram) for details.
- `index.css` contains NTUST EDA LAB theme, use it by adding the following yaml in `index.qmd`:
  ```yaml
  format:
    revealjs:
      css: index.css
  ```