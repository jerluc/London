let postcss = require("postcss");

module.exports = postcss.plugin("dark-theme", (opts = {}) => {
    const colorVar = /var\((--color.*?)\)/g;

    return (root, result) => {
        const darkRoot = postcss.atRule({
            name: "media",
            params: "(prefers-color-scheme: dark)",
        });
        root.walkRules((rule) => {
            const colorations = [];
            rule.walkDecls((decl) => {
                if (decl.value.match(colorVar)) {
                    colorations.push(decl);
                }
            });
            if (colorations.length > 0) {
                const darkRule = postcss.rule({
                    selector: rule.selector,
                });
                colorations.forEach(({ prop, value }) => {
                    darkRule.append({
                        prop,
                        value: value.replace("--color-", "--dark-color-"),
                    });
                });
                darkRoot.append(darkRule);
            }
        });
        root.append(darkRoot);
    };
});
