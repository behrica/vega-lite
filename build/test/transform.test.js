"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../src/log");
var transform_1 = require("../src/transform");
describe('normalizeTransform()', function () {
    it('replaces filter with timeUnit=yearmonthday with yearmonthdate and throws the right warning', log.wrap(function (localLogger) {
        var filter = {
            and: [
                { not: { timeUnit: 'yearmonthday', field: 'd', equal: { year: 2008 } } },
                { or: [{ field: 'a', equal: 5 }] }
            ]
        };
        var transform = [
            { filter: filter }
        ];
        chai_1.assert.deepEqual(transform_1.normalizeTransform(transform), [{
                filter: {
                    and: [
                        { not: { timeUnit: 'yearmonthdate', field: 'd', equal: { year: 2008 } } },
                        { or: [{ field: 'a', equal: 5 }] }
                    ]
                }
            }]);
        chai_1.assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3RyYW5zZm9ybS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGdDQUFrQztBQUlsQyw4Q0FBK0Q7QUFFL0QsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLEVBQUUsQ0FBQyw0RkFBNEYsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztRQUNwSCxJQUFNLE1BQU0sR0FBOEI7WUFDeEMsR0FBRyxFQUFFO2dCQUNILEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLGNBQTBCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQztnQkFDOUUsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUM7YUFDL0I7U0FDRixDQUFDO1FBQ0YsSUFBTSxTQUFTLEdBQWdCO1lBQzdCLEVBQUMsTUFBTSxRQUFBLEVBQUM7U0FDVCxDQUFDO1FBQ0YsYUFBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO2dCQUMvQyxNQUFNLEVBQUU7b0JBQ04sR0FBRyxFQUFFO3dCQUNILEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBQyxFQUFDO3dCQUNuRSxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQztxQkFDL0I7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi4vc3JjL2xvZ2ljYWwnO1xuaW1wb3J0IHtQcmVkaWNhdGV9IGZyb20gJy4uL3NyYy9wcmVkaWNhdGUnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vc3JjL3RpbWV1bml0JztcbmltcG9ydCB7bm9ybWFsaXplVHJhbnNmb3JtLCBUcmFuc2Zvcm19IGZyb20gJy4uL3NyYy90cmFuc2Zvcm0nO1xuXG5kZXNjcmliZSgnbm9ybWFsaXplVHJhbnNmb3JtKCknLCAoKSA9PiB7XG4gIGl0KCdyZXBsYWNlcyBmaWx0ZXIgd2l0aCB0aW1lVW5pdD15ZWFybW9udGhkYXkgd2l0aCB5ZWFybW9udGhkYXRlIGFuZCB0aHJvd3MgdGhlIHJpZ2h0IHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBjb25zdCBmaWx0ZXI6IExvZ2ljYWxPcGVyYW5kPFByZWRpY2F0ZT4gPSB7XG4gICAgICBhbmQ6IFtcbiAgICAgICAge25vdDoge3RpbWVVbml0OiAneWVhcm1vbnRoZGF5JyBhcyBUaW1lVW5pdCwgZmllbGQ6ICdkJywgZXF1YWw6IHt5ZWFyOiAyMDA4fX19LFxuICAgICAgICB7b3I6IFt7ZmllbGQ6ICdhJywgZXF1YWw6IDV9XX1cbiAgICAgIF1cbiAgICB9O1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtW10gPSBbXG4gICAgICB7ZmlsdGVyfVxuICAgIF07XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemVUcmFuc2Zvcm0odHJhbnNmb3JtKSwgW3tcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbmQ6IFtcbiAgICAgICAgICB7bm90OiB7dGltZVVuaXQ6ICd5ZWFybW9udGhkYXRlJywgZmllbGQ6ICdkJywgZXF1YWw6IHt5ZWFyOiAyMDA4fX19LFxuICAgICAgICAgIHtvcjogW3tmaWVsZDogJ2EnLCBlcXVhbDogNX1dfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfV0pO1xuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZGF5UmVwbGFjZWRXaXRoRGF0ZSgneWVhcm1vbnRoZGF5JykpO1xuICB9KSk7XG59KTtcbiJdfQ==