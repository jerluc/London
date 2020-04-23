let postcss = require("postcss");

module.exports = postcss.plugin("dark-theme", (opts = {}) => {
    const colorVar = /var\((--color.*?)\)/g;

    return (root, result) => {
        root.walkRules((rule) => {
            const colorations = [];
            rule.walkDecls((decl) => {
                if (decl.value.match(colorVar)) {
                    colorations.push(decl);
                }
            });
            if (colorations.length > 0) {
                const selectors = postcss.list.comma(rule.selector);
                const darkRule = postcss.rule({
                    selector: selectors
                        .map((s) => `[data-theme=dark] ${s}`)
                        .join(","),
                });
                colorations.forEach(({ prop, value }) => {
                    darkRule.append({
                        prop,
                        value: value.replace("--color-", "--dark-color-"),
                    });
                });
                rule.parent.append(darkRule);
            }
        });
    };
});
