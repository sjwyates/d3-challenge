const app = new Vue({
    el: '#app',
    data: {
        xOptions: [
            {
                key: 'poverty',
                title: 'In Poverty (%)'
            },
            {
                key: 'age',
                title: 'Age (Median)'
            },
            {
                key: 'income',
                title: 'Household Income (Median)'
            }
        ],
        yOptions: [
            {
                key: 'obesity',
                title: 'Obese (%)'
            },
            {
                key: 'smokes',
                title: 'Smokes (%)'
            },
            {
                key: 'healthcare',
                title: 'Lacks Healthcare (%)'
            }
        ],
        selectedX: 0,
        selectedY: 0,
    }
})