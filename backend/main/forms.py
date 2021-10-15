from django import forms


class FrmLogin(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'autofocus': 'autofocus',
                'class': 'form-control',
                'placeholder': 'Username'
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password'
            }
        )
    )
    admin = forms.BooleanField(required=False)
