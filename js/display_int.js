import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";
import { addConnectionLayoutSupport } from "./utils.js";
app.registerExtension({
    name: "rgthree.DisplayInt",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "Display Int (rgthree)") {
            let showValueWidget;
            nodeType.title_mode = LiteGraph.NO_TITLE;
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated ? onNodeCreated.apply(this, []) : undefined;
                showValueWidget = ComfyWidgets["STRING"](this, "output", ["STRING", { multiline: true }], app).widget;
                showValueWidget.inputEl.readOnly = true;
                showValueWidget.serializeValue = async (node, index) => {
                    node.widgets_values[index] = '';
                    return '';
                };
            };
            addConnectionLayoutSupport(nodeType, app, [['Left'], ['Right']]);
            const onExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                onExecuted === null || onExecuted === void 0 ? void 0 : onExecuted.apply(this, [message]);
                showValueWidget.value = message.text[0];
            };
        }
    },
});
